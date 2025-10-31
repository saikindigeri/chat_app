import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='h-[100vh] w-full bg-slate-400 flex flex-col items-center justify-center'>
        <h1>Chat with friends instantly</h1>
        <Link to="/login">
        <button className='bg-black text-white p-2 rounded-md '>
              Login
        </button>
        </Link>
    </div>
  )
}

export default Home