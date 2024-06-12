from datetime import datetime,timezone
import os
import ssl
from sqlalchemy import Column, Text, create_engine, Integer,String,DateTime,desc
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import Session
from sqlalchemy.orm import sessionmaker
from typing import List
from pydantic import BaseModel
from fastapi import FastAPI,Depends,HTTPException,UploadFile,File
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv("./.env")
# DB stuff
SQLALCHEMY_DATABASE_URL = "sqlite:///./sql.db"
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class Blog(Base):
    __tablename__ = "blogs"
    id = Column(Integer,primary_key=True)
    title = Column(String,index=True)
    content= Column(Text)
    desc = Column(String)
    created_at = Column(DateTime,default=timezone.utc)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
# Fast API stuff
class BlogCreateUpdate(BaseModel):
    id:int | None = None
    title:str
    desc:str
    content:str
    created_at:datetime | None = None
    class Config:
        orm_mode = True
class BlogListResponse(BaseModel):
    title:str
    desc:str
    id:int
    created_at:datetime
    class Config:
        orm_mode = True



UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()
ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
ssl_context.load_cert_chain('./cert.pem', keyfile='./key.pem')
app.add_middleware(CORSMiddleware,allow_origins=["*"],allow_methods=["*"],allow_headers=["*"])

@app.delete("/api/blogs/{blog_id}", response_model=BlogListResponse)
def delete_blog(blog_id: int, db: Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    db.delete(blog)
    db.commit()
    return blog

@app.post("/api/upload-image/")
async def upload_image(file: UploadFile = File(...)):
    try:
        # Ensure the uploaded file is an image
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid image file")

        # Generate a unique filename
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)

        # Save the file
        with open(file_path, "wb") as f:
            f.write(await file.read())

        return JSONResponse(content={"success": 1, "file": {"url": f"http://{os.environ['HOST']}/api/{UPLOAD_DIR}/{filename}"}})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Serve uploaded files
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
@app.post("/api/blogs",response_model=BlogListResponse)
def create_or_update_blog(blog: BlogCreateUpdate, db: Session = Depends(get_db)):
    if blog.id:
        db_blog = db.query(Blog).filter(Blog.id == blog.id).first()
        if not db_blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        db_blog.title = blog.title
        db_blog.desc = blog.desc
        db_blog.content = blog.content
        db.commit()
        db.refresh(db_blog)
    else:
        db_blog = Blog(
            title=blog.title,
            desc=blog.desc,
            content=blog.content,
            created_at=datetime.now(timezone.utc)
        )
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
    return db_blog
@app.get("/api/blogs",response_model=List[BlogListResponse])
def list_blogs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    blogs = db.query(Blog).order_by(desc(Blog.created_at)).offset(skip).limit(limit).all()
    return blogs
@app.get("/api/blogs/{blog_id}",response_model=BlogCreateUpdate)
def get_blog(blog_id:int,db:Session = Depends(get_db)):
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(status_code=404, detail="Blog not found")
    return blog
