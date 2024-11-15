import {
  encrypt,
  decrypt,
} from "../../../utils/aes-gcm.js";
import { PasswordInput } from '../../../components/passwordInput.js';
const { useEffect, useState } = React

export const CryptographyGCM = ({
  arrayBuffer,
  children,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [cryptoInfo, setCryptoInfo] = useState({});

  useEffect(() => {
    (async () => {
      const info = await encrypt({ input: arrayBuffer, password: passphrase, infoOnly: true })
      setCryptoInfo(info)
      window.x = info
    })()
  }, [passphrase]);

  const encryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try{
        const encrypted = await encrypt({
          input: arrayBuffer,
          password: passphrase
        });
        onSuccess(encrypted);
      } catch(err) {
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  };

  const decryptAes256 = async (onSuccess) => {
    if (arrayBuffer && passphrase) {
      try{
        const decrypted = await decrypt({
          input: arrayBuffer,
          password: passphrase,
        });
        console.log(decrypted);
        onSuccess(decrypted)
      } catch(err) {
        console.error('Decryption failed: ', err)
        alert('Decryption failed')
      }
    }
  };

  return (
    <>
      {((!passphrase) || passphrase) && (
        <div>
          <label htmlFor="input-pass">
            Input passphrase (ex. 123456)
          </label>
          <PasswordInput
            onChange={(e) => setPassphrase(e.target.value)}
            id="input-pass"
          />
        </div>
      )}

      {(passphrase) && (
        <>
          <details class="card">
            <summary>Details</summary>
            <div style={{ overflow: 'auto', whiteSpace: 'break-spaces' }}>
              {!!cryptoInfo && JSON.stringify(cryptoInfo, null, 2)}
            </div>
          </details>

          {children({ onEncrypt: encryptAes256, onDecrypt: decryptAes256 })}
        </>
      )}
    </>
  )
}
