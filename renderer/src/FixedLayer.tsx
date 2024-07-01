import { useSelector } from "react-redux"
import { RootState } from "./store/store"
import './FixedLayer.css';

export default function FixedLayer({children}: {children: JSX.Element}) {
    const {announce,visible} = useSelector((state: RootState) => state.announce);
    
    return (
        <div className="fixed-layer">
            <div className="announce" style={{opacity: (visible ? 1 : 0)}}>
                {announce}
            </div>

            {children}
        </div>
    )
}