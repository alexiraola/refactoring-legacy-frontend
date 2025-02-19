import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import './library/libraryApp.css'
import './index.css'
import { LibraryApp } from "./library/libraryApp";
import { Factory } from '../factory';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LibraryApp service={Factory.createLibraryService()} />
  </React.StrictMode>,
)
