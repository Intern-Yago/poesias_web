import { NextResponse } from "next/dist/server/web/spec-extension/response";

export default function middleware(req){
    let verify = req.cookies.get("token")
    let url = req.url
    if(!verify && url.includes('/poeta')){
        return NextResponse.redirect("http://localhost:3000/login")
    }
}