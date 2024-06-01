import axios from "axios"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config"
import { tr } from "date-fns/locale";

export interface Blogstype {
    "id": number;
    "title": string
    "content":string
    "author": {
        "name": string
    },
    "createdAt": string
}

export interface BlogReturnType {
    writeBlog: (title: string, content: string) => Promise<number>
}


// fetch all blogs if user logged in
export const useBlogs = () => {
    const [loading, setLoading]= useState(true)
    const [blogs, setBlogs] = useState<Blogstype []>()
    
    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " +  localStorage.getItem("token")
            }
        })
        .then(response => {
            console.log(blogs)
            setBlogs(response.data.bulkBlog)
            setLoading(false)
        })
        .catch((err) => {
            console.log('Error while fetching blogs:', err)
            setLoading(false)
        })
    }, [])
    
    return {
        loading,
        blogs
    }
}

// fetch specific blog by given id if user logged in
export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading]= useState(true)
    const [blog, setBlog] = useState<Blogstype>()

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " +  localStorage.getItem("token")
            }
        })
            .then(response => {
                setBlog(response.data.blog)
                setLoading(false)
            })
            .catch((err) => {
                console.log('Error while fetching blogs:', err)
                setLoading(false)
            })
    }, [id])

    return {
        loading,
        blog
    }
}

// write your own blog
export const useWriteBlog = (): BlogReturnType => {

    const writeBlog = async(title: string, content: string): Promise<number>  => {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                title,
                content
                }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem('token')
                }
            })
            return response.data.id //return blog id, which can help to navigate other page
        }
        catch (err) {
            console.log('Error while posting blog', err);
            throw err;
        }
    }

    return { 
        writeBlog,
    }
}