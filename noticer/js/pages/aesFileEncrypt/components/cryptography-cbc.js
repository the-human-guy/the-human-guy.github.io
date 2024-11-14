import {
  encryptAes,
  getKeyFromPassphrase,
  getIvFromPassphrase,
  decryptAes,
} from "../../../utils/aes_encryption.js";
import { is256BitHex } from "../../../utils/rgx_test.js";
import { PasswordInput } from '../../../components/passwordInput.js';
const { useEffect, useState } = React

export const CryptographyCBC = ({
  arrayBuffer,
  children,
}) => {
  const [passphrase, setPassphrase] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [aesIv, setAesIv] = useState("");
  const onPassPhraseChange = (e) => {
    setPassphrase(e.target.value);
  };
  const onKeyInputChange = async (e) => {
    setAesKey(e.target.value);
    const ivHex = await e.target.value.substring(0, 32);
    setAesIv(ivHex);
  };

  useEffect(() => {
    const getAesKey = async () => {
      if (passphrase) {
        const keyHex = await getKeyFromPassphrase(passphrase);
        setAesKey(keyHex);
      } else {
        setAesKey("");
      }
    };
    getAesKey();
    const getAesIv = async () => {
      if (passphrase) {
        const ivHex = await getIvFromPassphrase(passphrase);
        setAesIv(ivHex);
      } else {
        setAesIv("");
      }
    };
    getAesIv();
  }, [passphrase]);

  const encryptAes256 = async (onSuccess) => {
    if (arrayBuffer && (passphrase || is256BitHex(aesKey))) {
      try{
        const encrypted = await encryptAes(
          arrayBuffer,
          aesKey,
          aesIv
        );
        onSuccess(encrypted);
      }catch(err){
        console.error('Encryption failed: ', err)
        alert('Encryption failed')
      }
    }
  };

  const decryptAes256 = async (onSuccess) => {
    try{
      const decrypted = await decryptAes(
        arrayBuffer,
        aesKey,
        aesIv
      );
      console.log('decryption result: ', arrayBuffer, decrypted);
      onSuccess(decrypted)
    } catch(err) {
      console.error('Decryption failed: ', err)
      alert('Decryption failed')
    }
  };

  return (
    <>
      {((!passphrase && !aesKey) || passphrase) && (
        <div>
          <label htmlFor="input-pass">
            Input passphrase (ex. 123456)
          </label>
          <PasswordInput
            onChange={onPassPhraseChange}
            id="input-pass"
          />
        </div>
      )}

      {((!passphrase && !aesKey) || (!passphrase && aesKey)) && (
        <div>
          <label htmlFor="small-input">
            Or Input key (256bit Hex) (<span data-tooltip="8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92">example</span>)
          </label>
          <PasswordInput
            onChange={onKeyInputChange}
            id="small-input"
          />
          {aesKey && !is256BitHex(aesKey) && (
            <div>
              Key must be 256bit hex
            </div>
          )}
        </div>
      )}
      {(passphrase || aesKey) && (
        <>
          <details class="card">
            <summary>Details</summary>
            <div style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
              <div>
                <span>
                  Encryption algorithm:
                </span>{" "}
                AES-CBC
              </div>
              {passphrase && (
                <div>
                  <span>Key algorithm:</span>{" "}
                  Passphrase + SHA256
                </div>
              )}

              <div>
                <span>
                  Key (hex)(256bit):
                </span>{" "}
                {aesKey}
              </div>
              <div>
                <span>Iv algorithm:</span> Key
                + substring(0, 32)
              </div>
              <div>
                <span>Iv (hex)(128bit):</span>{" "}
                {aesIv}
              </div>
              <div>
                <span>Padding :</span> PKCS#7
              </div>
              <div>
                <span>Openssl Equivalent:</span>
              </div>
              <div>
                <span>Encrypt:</span> openssl
                enc -aes-256-cbc -nosalt -e -in input.jpg -out
                output.jpg -K {aesKey} -iv {aesIv}
              </div>
              <div>
                <span>Decrypt:</span> openssl
                enc -aes-256-cbc -nosalt -d -in input.jpg -out
                output.jpg -K {aesKey} -iv {aesIv}
              </div>
            </div>
          </details>

          {children({ onEncrypt: encryptAes256, onDecrypt: decryptAes256 })}
        </>
      )}
    </>
  )
}
