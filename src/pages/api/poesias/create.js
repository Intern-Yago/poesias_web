import { prisma } from "../../../lib/prisma"

export default async function (req,res){
    const {autor,mensagem} = req.body
    await prisma.poetrys.create({
        data:{
            autor,
            mensagem
        }
    } )

    return res.status(201).json({})
}