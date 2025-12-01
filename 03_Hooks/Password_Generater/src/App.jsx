import {  useState, useCallback, useEffect ,useRef, use} from 'react'
import './App.css'
import { normalizeModuleId } from 'vite/module-runner';

function App() {
  const [length, setLength] = useState(8);
  const [isNum, setIsnum] = useState(false);
  const [isSym, setIssym] = useState(false);
  const [password, setPassword] = useState('');
  const generatePassword = useCallback(() => {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (isNum) {
      chars += "0123456789";
    }
    if (isSym) {
      chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    }
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }
    setPassword(password);
  }, [length, isNum, isSym, setPassword]);
  const passCopy = useCallback(() => {
    passwordRef.current?.select();
    window.navigator.clipboard.writeText(password);
   }, [password]);
  //useRef
  const passwordRef = useRef(null);

   useEffect(() => {
    generatePassword();
  }, [generatePassword]);
  
  return (
    <div className="container">
      <h1>Password Generator</h1>
      <div className="password-display">
        <input type="text" value={password} readOnly ref={passwordRef} />
        <button
          onClick={passCopy} >
          Copy
        </button>
      </div>
      <div className="controls">
        <div className="control">
          <label>Password Length: {length}</label>
          <input
            type="range"
            min="8"
            max="100"
            step="1"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
          />
        </div>
        <div className="control">
          <label>
            <input
              type="checkbox"
              checked={isNum}
              onChange={(e) => {
                setIsnum(e.target.checked);
              }}
            />
            Include Numbers
          </label>
        </div>
        <div className="control">
          <label>
            <input
              type="checkbox"
              checked={isSym}
              onChange={(e, k) => {
                setIssym(e.target.checked);
              }}
            />
            Include Symbols
          </label>
        </div>
        <button onClick={generatePassword} className="generate-btn">
          ReGenerate Password
        </button>
      </div>
    </div>
  );
}

export default App
