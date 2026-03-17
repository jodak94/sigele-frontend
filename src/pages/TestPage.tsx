import { useState, useEffect } from 'react';

interface UserResponse {
    id: number;
    name: string;
}
export function TestPage(){
    
    const [filter, setFilter] = useState("")
    const [debouncedFilter, setDebouncedFilter] = useState("")
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState<UserResponse[]>()
    useEffect(() => {
        if(!debouncedFilter) return;
        const controller = new AbortController(); 
        async function getData(){
            setLoading(true)
            const url = `https://jsonplaceholder.typicode.com/users?name=${debouncedFilter}`
            const response = await fetch(url);
            setData(await response.json())
            setLoading(false)
        }
        getData()
        return () => controller.abort(); 
    }, [debouncedFilter])
    
    useEffect(() => {
        const timeout = setTimeout(() =>{
            setDebouncedFilter(filter)
        }, 500)

        return () => clearTimeout(timeout);
    }, [filter])


    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <label>Name</label><input 
          style={{'padding':5, 'margin':5 }} type="text" value={filter} onChange={(e) => setFilter(e.target.value)}></input>  

          {loading && (
            <p>Loading</p>
          )}
          {data?.map((user)=>
              <li key={user.id}>{user.id} - {user.name}</li>
          )}

        </div>
    );
}