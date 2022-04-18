import React from 'react'
import Loader from '../Components/Loader'
import ProductCard from '../Components/ProductCard'
import { useAxiosGet } from '../Hooks/HttpRequests'
import question from '../Assets/2015-A-1.jpg'

function Home() {
    return (
        <div className="container mx-auto">
            <img src={question} alt="2015-A-1" />

            <div>
                <input type="radio" value="A" name="gender" /> A) Starfish 
                <input type="radio" value="B" name="gender" /> B) Dog 
                <input type="radio" value="C" name="gender" /> C) Sea lion 
                <input type="radio" value="D" name="gender" /> D) Giraffe 
            </div>
        </div>
    )
}

export default Home