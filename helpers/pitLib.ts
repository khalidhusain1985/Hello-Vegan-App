import {env} from "./env";
import moment from "moment";
import {PaginatedApiResponse, User} from "../types";
import axios from "axios";
import {endpoints} from "./endpoints";

export const pitLib={
    auth:{
        get:function ():User {
            return JSON.parse(localStorage.getItem(env.KEYWORDS.USER_SESSION_KEY)??null)
        },
        set:function (data:string) {
            return localStorage.setItem(env.KEYWORDS.USER_SESSION_KEY,data)
        },
        clear:function () {
            return localStorage.clear()
        },
        is:function () {
            return !!localStorage.getItem(env.KEYWORDS.USER_SESSION_KEY)
        },
    },
    response:{
        send:function (status:boolean|null=null,message:string|null=null,data:any=null) {
            if (!status){
                status =false;
                if (!message){
                    message ='Unable to perform this action'
                }
            } else {
                status =true;
                if (!message){
                    message ='Action performed successfully'
                }
            }
            return {status:status,message:message,data:data}
        },
    },
    swal:async function (title:null|string|undefined,icon:'info'|'success'|'error'|'warning'|'question'|null,position:null|'bottom-right'|'top-right',timer:null|number) {
        if(!position){
            position='bottom-right'
        }
        if(!title&&icon){
            if (['warning','error'].includes(icon)){
                title=Env.MESSAGE.NEGATIVE
            }
            if (['info','success'].includes(icon)){
                title=Env.MESSAGE.POSITIVE
            }
        }
        timer=timer??5000
        return await Swal.fire({
            position: position,
            icon: icon,
            title: title,
            showConfirmButton:false,
            timerProgressBar:true,
            timer: timer,
        })
    },
    util:{
        test:function (content:string="test"){
            alert(content)
        },
        headers:function () {
            return {
                Authorization: "Bearer "+pitLib.auth.get()?.token,
            }
        },
        url:function (uri:string):string {
            return uri.includes("http")?uri:env.FRONTEND+uri
        },
        trimmer:function (paragraph:string,length:number=15):string{
            const words = paragraph.split(' ');
            if (words.length > length) {
                return words.slice(0, length).join(' ') + '...';
            }
            return paragraph;
        }
    },
    media:{
        getBase64: (file:any) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        }),
        pluck:function (fromArray:Array<any>,key:string="ref_code",value:string){
            return typeof fromArray=='object'? fromArray.filter((a:any) =>a[key]==value):env.NO_IMG_USER
        },
        pluckFirst:function (fromArray:Array<any>,key:string|null="ref_code",value:string):string{
            if(!fromArray){
                return env.NO_IMG
            }
            if(!key){
                key ='ref_code'
            }
            let x= fromArray.filter((a:any) =>a[key]==value)
            if(!x.length){
                return env.NO_IMG
            }
            x=x[0]
            return x.path.includes("http")?x.path:env.BASEPOINT + x.path
        }
    },
    dt:{
        fromNow: function (v:any) {
            return moment(v).fromNow()
        },
        diffDays: function (d1:any,d2:any) {
            const startDate = moment(d1);  // Start date
            const endDate = moment(d2);    // End date
            return endDate.diff(startDate, 'days');
        },
    },
    notify: async function (title:string,content:string,target_user:string) {
        return axios.post(
            endpoints.notification.create,
            {
                title:title,content:content,target_user:target_user
            },
            {
                headers: pitLib.util.headers(),
            }
        )
    },
    pluckByKeyValue: function (fromArray:Array<any>,key:string,value:string){
        return fromArray.filter((a:any) =>a[key]==value)
    },
    go:function (url:string,target:string|undefined=undefined){
        if(target){
            window.open(url, '_blank');
        } else {
            location.href=url;
        }
    }
}