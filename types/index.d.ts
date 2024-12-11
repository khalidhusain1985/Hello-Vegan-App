export interface ApiResponse {
    status:boolean;
    message:string;
    data:any;
}
// Paginated Response
export interface PaginatedApiResponse {
    status:boolean;
    message:string;
    data:{
        total:number;
        pagination:number;
        page:number;
        pages:number;
        filtered:number;
        data:Array<any>;
    };
}
// Paginated Response
//User
export interface User {
    _id:string;
    name:string;
    email:string;
    phone:string;
    address:string;
    password:string;
    fcm_token:string;
    token:string;
    socket:string;
    role:string;
    verified:['phone'|'email'];
    status:'pending'|'active'|'disabled';
}
//User