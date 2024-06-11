'use client'
import BlogCard from "@/components/BlogCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = process.env.API_URL
export default function BlogList(){
  const [blogPosts, setblogPosts] = useState<[]>() 
  const router = useRouter()
  useEffect(()=>{
    async function grabData() {
      const response = await fetch(`${API_URL}blogs`) 
      const data = await response.json()  
      setblogPosts(data)
    }
    grabData()
  },[])
  return (
    <div className="bg-neutral-900 min-h-screen overflow-auto" >

      <div className="flex justify-center py-10">
        <div id='grid_container' className="md:px-10 grid grid-flow-row xl:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
        {blogPosts && blogPosts.map((post:{created_at:string,title:string,id:number,desc:string},i) =>
          <BlogCard key={i} date={post.created_at} title={post.title} desc={post.desc} imgSrc="/lock_bg.jpg" goTo={()=>router.push(`/blog/${post.id}`)}/>
                      )}
        </div>
      </div>
    </div>

  ) 
}
