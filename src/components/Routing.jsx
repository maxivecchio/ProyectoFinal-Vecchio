import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import TaskList from './TaskList'
import ListItem from './ListItem'

const Routing = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/taskList' element={<TaskList />} />
                    <Route path='/producto/:id' element={<ListItem/>}/>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default Routing