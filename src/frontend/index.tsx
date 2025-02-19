import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './libraryApp.css'
import './index.css'
import { LibraryApp } from "./libraryApp";
import { Factory } from './infrastructure/factory';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LibraryApp service={Factory.createLibraryService()} />
  </React.StrictMode>,
)
