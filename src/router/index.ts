import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import {pitLib} from "../../helpers/pitLib";
import Chat from "@/views/Chat.vue";
import Friends from "@/views/me/Friends.vue";
import Login from "@/views/Login.vue";
import axios from "axios";
import {PaginatedApiResponse} from "../../types";
import {endpoints} from "../../helpers/endpoints";
import {env} from "../../helpers/env";
import {store} from "../../store/DataLake";

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name:'Home',
    redirect: '/home'
  },
  // {
  //   path: '/folder/:id',
  //   component: () => import ('../views/FolderPage.vue')
  // },
  {
    path: '/notifications',
    name:"Notifications",
    component: () => import ('../views/Notifications.vue'),
  },
  {
    name:"Vegan log",
    path: '/home',
    component: () => import ('../views/veganlog/VeganLog.vue')
  },
  {
    name:"Reels",
    path: '/reel',
    component: () => import ('../views/reel/Reel.vue')
  },
  {
    name:"Vegan log details",
    path: '/veganlog/:_id',
    component: () => import ('../views/veganlog/VeganLogById.vue')
  },
  {
    name:"Blogs",
    path: '/blog',
    component: () => import ('../views/blog/Blog.vue')
  },
  {
    path: '/blog/detail/:slug',
    component: () => import ('../views/blog/BlogBySlug.vue')
  },
  {
    name:"Create Blog",
    path: '/blog/create',
    component: () => import ('../views/blog/BlogCreate.vue')
  },
  {
    name:"News",
    path: '/news',
    component: () => import ('../views/news/News.vue')
  },
  {
    path: '/news/detail/:slug',
    component: () => import ('../views/news/NewsBySlug.vue')
  },
  {
    name:"Restaurants",
    path: '/recommendation/restaurant',
    component: () => import ('../views/recommendation/restaurant/Restaurant.vue')
  },
  {
    name:"Restaurants Details",
    path: '/recommendation/restaurant/:slug',
    component: () => import ('../views/recommendation/restaurant/RestaurantBySlug.vue')
  },
  {
    name:"Events",
    path: '/events',
    component: () => import ('../views/event/Event.vue')
  },
  {
    name:"Event",
    path: '/event/:slug',
    component: () => import ('../views/event/EventBySlug.vue')
  },
  {
    name:"New Event",
    path: '/event/create/new',
    component: () => import ('../views/event/EventCreate.vue')
  },
  {
    name:"Recipes",
    path: '/recipes',
    component: () => import ('../views/recipe/Recipe.vue')
  },
  {
    name:"Recipe Detail",
    path: '/recipe/:slug',
    component: () => import ('../views/recipe/RecipeBySlug.vue')
  },
  {
    name:"New Recipe",
    path: '/recipe/create/new',
    component: () => import ('../views/recipe/RecipeCreate.vue')
  },
  {
    path: '/login',
    name:"Login",
    component: () => import ('../views/Login.vue'),
  },
  {
    path: '/forgot-password',
    name:"Forgot Password",
    component: () => import ('../views/ForgotPassword.vue'),
  },
  {
    path: '/signup',
    name:"Signup",
    component: () => import ('../views/SignUp.vue'),
  },
  {
    path: '/me',
    name:"Account",
    component: () => import ('../views/me/Me.vue'),
  },
  {
    path: '/me/profile',
    name:"Profile",
    component: () => import ('../views/me/Profile.vue'),
  },
  {
    path: '/subscription/purchase',
    name:"Subscription Purchase",
    component: () => import ('../views/me/SubscriptionPurchase.vue'),
  },
  {
    path: '/me/subscription',
    name:"Subscription",
    component: () => import ('../views/me/Subscription.vue'),
  },
  {
    path: '/friends',
    name:"Friends",
    component: () => import ('../views/me/Friends.vue'),
  },
  {
    path: '/chat/:_id',
    name:"Chat",
    component: () => import ('../views/Chat.vue'),
  },
  {
    path: '/groups',
    name:"Groups",
    component: () => import ('../views/group/Group.vue'),
  },
  {
    path: '/group',
    name:"Groups",
    component: () => import ('../views/group/Group.vue'),
  },
  {
    path: '/group/create',
    name:"Create Group",
    component: () => import ('../views/group/GroupCreate.vue'),
  },
  {
    path: '/group/:_id',
    name:"Group Chat",
    component: () => import ('../views/group/GroupChat.vue'),
  },
  {
    path: '/videocall/:_id',
    name:"Video Call",
    component: () => import ('../views/videocall/VideoCall.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
router.beforeEach(async (to, from, next) => {
  // Check if the route is not 'Login' or 'Signup'
  if (to.name !== 'Login' && to.name !== 'Signup' && to.name !== 'Forgot Password') {
    try {
      // Make the API call to check if the user is authenticated
      const response = await axios.post<PaginatedApiResponse>(
          endpoints.user.list,
          {
            _id: pitLib.auth.get()?._id,  // Ensure pitLib.auth.get() doesn't return null or undefined
          },
          {
            headers: pitLib.util.headers(),
          }
      );

      // If the API call doesn't return a successful status, redirect to Login
      if (!response.data.status) {
        next({ name: 'Login' });
      } else {
        // Continue with navigation if the user is authenticated
        store.state_user=response.data.data.data?.[0]
        next();
      }
    } catch (error) {
      // Handle API call failure
      console.error('API request failed:', error);
      next({ name: 'Login' }); // Redirect to login page if there's an error
    }
  } else {
    // Allow navigation if the route is 'Login' or 'Signup'
    next();
  }
});


export default router
