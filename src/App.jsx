import { GetData } from "./COMPONENTS";
import { getData} from "./UTILS/getData";
import './App.css';


function App() {
  return (

        <div className="row">
          <GetData fetchData={getData} />
        </div>
  );
}

export default App;
