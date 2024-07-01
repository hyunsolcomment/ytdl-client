import Input from "../components/Input";
import TaskList from "../components/TaskList";
import './App.css';
import './Header.css';

export default function App() {
    return (
        <div className="app">
            <header>
                <div className="left">
                    <div className="logo">YTDL</div>    
                </div>

                <div className="right">
                    
                </div>
            </header>

            <section>
                <Input />
                <TaskList />
            </section>

            <footer>

            </footer>
        </div>
    )
}