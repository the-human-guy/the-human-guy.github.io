import {
  encryptAes,
  getKeyFromPassphrase,
  getIvFromPassphrase,
  decryptAes,
} from "../../utils/aes_encryption.js";
import { is256BitHex } from "../../utils/rgx_test.js";
import { FileEditor } from './components/fileEditor.js';

const { useEffect, useState } = React

const FILE_MAX_SIZE = 1024 * 1024 * 50
const FILE_MAX_SIZE_LABEL = 'max. 50MB'

export function AesFileEncryptPage() {
  const [inputFile, setInputFile] = useState(null);
  const [algorithm, setAlgorithm] = useState("AES256");
  const [passphrase, setPassphrase] = useState("");
  const [aesKey, setAesKey] = useState("");
  const [aesIv, setAesIv] = useState("");
  const [usingEditor, setUsingEditor] = useState(false)
  const [rsaKeyPair, setRsaKeyPair] = useState({});

  const changeFile = (files) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > FILE_MAX_SIZE) {
      return alert(FILE_MAX_SIZE_LABEL);
    }
    console.log(files);

    setInputFile(file);
    setTimeout(() => {
        // document.getElementById("file-input-form").reset();
    }, 50);
  };

  const onAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

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

  const encryptAes256 = () => {
    if (inputFile && (passphrase || is256BitHex(aesKey))) {
      const reader = new FileReader();
      reader.onload = async function () {
        try{
          const encrypted = await encryptAes(
            reader.result,
            aesKey,
            aesIv
          );
          saveOrOpenBlob(new Blob([encrypted]), inputFile.name || "encrypted");
        }catch(err){
          alert('Encryption failed')
        }
        
      };
      reader.readAsArrayBuffer(inputFile);
    }
  };

  // action: 'save' | 'edit'
  const decryptAes256 = (action) => {
    if (inputFile && (passphrase || is256BitHex(aesKey))) {
      const reader = new FileReader();
      reader.onload = async function () {
        try{
          const decrypted = await decryptAes(
            reader.result,
            aesKey,
            aesIv
          );
          console.log(decrypted);
          if (action === 'save') {
            saveOrOpenBlob(new Blob([decrypted]), inputFile.name || decrypted);
          } else if (action === 'edit') {
            setInputFile(new File([new Blob([decrypted], { type: 'text/plain' })], `decrypted-${inputFile.name}`))
            openInEditor()
          }
        }catch(err){
          alert('Decryption failed')
        }
       
      };
      reader.readAsArrayBuffer(inputFile);
    }
  };

  const saveOrOpenBlob = (blob, fileName) => {
    const tempEl = document.createElement("a");
    document.body.appendChild(tempEl);
    const url = window.URL.createObjectURL(blob);
    tempEl.href = url;
    tempEl.download = fileName;
    tempEl.click();
    window.URL.revokeObjectURL(url);
  };

  const openInEditor = () => setUsingEditor(true)

  return (
    <main style={{ paddingBottom: '7rem' }}>
      <div>
        <h1>AES256 File Encrypt</h1>

        {/* file input */}
        <form id="file-input-form">
          <label htmlFor="dropzone-file">
              <span>Click to upload a file ({FILE_MAX_SIZE_LABEL})</span>
              <input
                id="dropzone-file"
                type="file"
                onChange={(e) => changeFile(e.target.files)}
              />
          </label>
        </form>
      </div>

      <div class="row">
        <div class="col">
          {inputFile && (
            <fieldset>
              <legend>File Info</legend>
              <div>
                <span>File name:</span>{" "}
                {inputFile.name}
              </div>
              <div>
                <span>Last modified date:</span>{" "}
                {inputFile.lastModifiedDate.toString()}
              </div>
              <div>
                <span>Size:</span> {inputFile.size}
              </div>
              <div>
                <span>Type:</span> {inputFile.type}
              </div>
              <button type="button" onClick={() => openInEditor()}>Open in editor</button>
            </fieldset>

          )}
        </div>
        <div class="col">
          {algorithm === "AES256" && inputFile && (
            <fieldset>
              <legend>Cryptography</legend>
              {((!passphrase && !aesKey) || passphrase) && (
                <div>
                  <label htmlFor="input-pass">
                    Input passphrase (ex. 123456)
                  </label>
                  <input
                    onChange={onPassPhraseChange}
                    type="text"
                    id="input-pass"
                  />
                </div>
              )}

              {((!passphrase && !aesKey) || (!passphrase && aesKey)) && (
                <div>
                  <label htmlFor="small-input">
                    Or Input key (256bit Hex) (ex.
                      8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92)
                  </label>
                  <input
                    onChange={onKeyInputChange}
                    type="text"
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
                  <div>
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
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={encryptAes256}
                    >
                      Encrypt
                    </button>
                    <button
                      type="button"
                      onClick={() => decryptAes256('save')}
                    >
                      Decrypt & Save
                    </button>
                    <button
                      type="button"
                      onClick={() => decryptAes256('edit')}
                    >
                      Decrypt & Edit
                    </button>
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
                </>
              )}
            </fieldset>
          )}

          {algorithm === "RSA" && inputFile && (
            <RsaKeyEncrypt/>
          )}
        </div>
      </div>

      {!!usingEditor && (
        <div class="card info">
          <p>Editor</p>
          <FileEditor file={inputFile} onSave={(editedFile) => setInputFile(editedFile)} />
        </div>
      )}

    </main>

  );
}

