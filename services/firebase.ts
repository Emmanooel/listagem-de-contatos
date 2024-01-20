import {getApp, getApps, initializeApp} from "firebase/app";
import { getDatabase, ref, remove, push, onValue, update, child } from 'firebase/database'

const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  };

  if(!getApps.length){
    initializeApp(firebaseConfig)
  } 
  
  const firebaseApp = getApp()
  

  const database = getDatabase(firebaseApp)

  export {database, ref, remove, push, onValue, update, child}