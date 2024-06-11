'use client'
import { useEffect, useState } from "react"
import Editor from "@/components/Editorjs"
import { useRouter } from "next/navigation"

const API_URL = "http://localhost:8000/api/"
export default function Blog({params}:{params:{blogid:number}}){
  const nav = useRouter()
  const [title,setTitle] = useState<string>();
  const [desc,setDesc] = useState<string>();
  const [data, setData] = useState();
  const [date, setdate] = useState()
  const [recentPosts, setrecentPosts] = useState()
  const getRecent = async () =>{
    const response = await fetch(`${API_URL}blogs?limit=4`)
    if (response.status ==200) {
      const data = await response.json()
      setrecentPosts(data)
    }
  }
  useEffect(() => {
    const fetchData = async () =>{
      const response = await fetch(`${API_URL}blogs/${params.blogid}`)
      const data = await response.json()
      setTitle(data.title)      
      setDesc(data.desc)
      setdate(data.created_at)
      console.log(data);
      
      setData(JSON.parse(data.content))
    }
    fetchData();
    getRecent();
  }, [])
  
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900">
      <div className="bg-neutral-100 dark:bg-neutral-800 lg:px-48 md:px-24 px-10 py-10">
        <div className="text-5xl font-bold dark:text-white text-slate-800">{title}</div>
        <div className="pt-8 text-neutral-500 dark:text-neutral-400">{desc}</div>
        <div className="text-right pt-5 italic text-neutral-400 dark:text-neutral-500">{new Date(date).toLocaleDateString('en-US',{weekday:"long",year:"numeric",month:"short",day:"numeric"})}</div>
      </div>
      <div className="mx-5 flex lg:flex-row flex-col lg:items-start">

        {data &&
        <div className="editor w-full text-white flex items-center justify-center">
              <Editor data={data} onChange={setData} editorblock="editorjs-container" readOnly={true} />
        
        </div>
        }
        <div className="sticky top-10 mt-16 lg:mx-0 mx-16">
          <div className="text-slate-800 dark:text-white font-bold mb-5 ml-3 text-xl">Recent posts</div>
          <div className="mb-10 lg:w-96 border-neutral-600 rounded-3xl border-1 overflow-hidden">
  
          {recentPosts && recentPosts.map((post,i)=> {
            if (post.id != params.blogid) {
              return <div onClick={()=>nav.push(`/blog/${post.id}`)} className={`py-2 px-3 flex items-center justify-center overflow-hidden border-b-neutral-700 cursor-pointer ${i == recentPosts.length -1 ? "":"border-b-1"}`}>

                <div className="overflow-hidden">
                  <div className="whitespace-nowrap  overflow-hidden overflow-ellipsis dark:text-white text-neutral-700">{post.title}</div>
                  <div className="whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400 overflow-hidden overflow-ellipsis">{post.desc}</div>
                </div>
                <div className="h-14 w-14 flex items-center justify-center"><svg className="stroke-neutral-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 6L15 12L9 18" stroke="inherit" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ></path> </g></svg></div>
              </div>
            }
          }
              )}
          </div>
        </div>
        
      </div>
    </div>
  )
}
