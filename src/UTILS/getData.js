import {client} from '../API'


export const getData = async()=>{
    try{
        const {data} = await client.get('')
        return data
    }catch(error){
        const err=error
        console.log(err.message)
        console.log(err.name)
        return[]
    }
}
