import Input from "../components/Input";
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
            </section>

            <footer>

            </footer>
        </div>
    )
}