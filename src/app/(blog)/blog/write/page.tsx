
"use client"
import dynamic from 'next/dynamic'
const Editor = dynamic(() => import('@/components/Editorjs'), {
  ssr: false,
})
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL
export default function WriteBlog(){
  const ref = useRef(null)
  const [title,setTitle] = useState<string>();
  const nav = useRouter()
  const [desc,setDesc] = useState<string>();
  const [data, setData] = useState({
  time: new Date().getTime(),
  blocks: [
    {
      type: "header",
      data: {
        text: "This is my awesome editor!",
        level: 1,
      },
    },
  ],
});
  const saveData = async () =>{
    const response = await fetch(`${API_URL}blogs`,{
      method:'POST',
      body:JSON.stringify({
        content:JSON.stringify(data),
        desc:desc,
        title:title
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const responseData = await response.json()
    if (response.status == 200 && responseData.id) {
      nav.push(`/blog/${responseData.id}`)
    }

  }
  return (
    <div className='min-h-screen flex flex-col p-10 justify-center items-center text-black dark:text-neutral-100 dark:bg-neutral-900'>
      <div className='my-2 w-full lg:w-2/3'>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} type="text" className="w-full  rounded-md dark:bg-neutral-800 bg-gray-50 py-2 px-3 dark:outline-neutral-800 outline-none outline-gray-100" placeholder='Title' />
      </div>
      <div className='my-2 w-full lg:w-2/3'>
        <textarea value={desc} onChange={(e)=>setDesc(e.target.value)} rows={5} className="w-full dark:bg-neutral-800  rounded-md bg-gray-50 py-2 px-3 outline-none dark:outline-neutral-800  outline-gray-100" placeholder='Description' />
      </div>
      <div className="editor mt-5 w-full  relative">
      {data && 
            <Editor data={data} onChange={setData} editorblock="editorjs-container" />
      }
      </div>
      <div>
        <div onClick={saveData} className='rounded-md text-white py-2 px-3 bg-emerald-500 cursor-pointer hover:bg-emerald-600'>Save</div>
      </div>
    </div>
    

     


  )
}


