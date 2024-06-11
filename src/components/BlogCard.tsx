import { log } from "console"
import Image from "next/image"

type BlogCard =  {
  desc: string
  title:string
  imgSrc:string
  goTo:()=>void
  date:string
}

export default function BlogCard({desc,title,imgSrc,goTo,date}:BlogCard){
  return (
          <div id='card-container' className="relative shadow-md h-96 w-72 rounded-md bg-neutral-800  cursor-pointer hover:scale-105 transition-all hover:shadow-2xl" onClick={goTo}>
            <div className="h-48 w-72 relative z-0 rounded-t-md overflow-clip">
              <Image src={imgSrc} fill={true} alt="image alt" className="z-0" />
            </div>
            <div id='card-body'className="p-2 flex flex-col items-start">
              <div id='card-header' className="mb-2 p-1 rounded-sm   font-bold text-xl text-white -mt-5 -ml-5 z-10 relative bg-neutral-600">{title}</div>
              <div id='card-desc' className=" overflow-ellipsis w-full h-full line-clamp-3 text-zinc-400">{desc}</div>
              <div className="text-right pt-5 italic text-neutral-600 absolute bottom-2 right-3">{new Date(date).toLocaleDateString('en-US',{weekday:"short",year:"numeric",month:"short",day:"numeric"})}</div>
            </div>
          </div>
  )
}
