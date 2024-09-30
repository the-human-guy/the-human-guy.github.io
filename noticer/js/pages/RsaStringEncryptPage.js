import { generateRSAKeyPair, encryptStringRsa } from "../utils/RSA_encryption.js";

const { useState } = ReactRouterDOM;

export const RsaStringEncryptPage = () => {
  const [inputString, setInputString] = useState("");
  const [encryptedString, setEncryptedString] = useState("");
  const [rsaKeyPair, setRsaKeyPair] = useState({
    publicKey: "",
    privateKey: "",
  });


  const downloadPemFile = (content, fileName) => {
    const link = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const generateRSAKey = async () => {
    const keyPair = await generateRSAKeyPair();
    setRsaKeyPair(keyPair);
  };

  const downloadPemFiles = () => {
    if (rsaKeyPair.privateKey) {
      downloadPemFile(rsaKeyPair.privateKey, "rsa_private.pem");
    }
    if (rsaKeyPair.publicKey) {
      downloadPemFile(rsaKeyPair.publicKey, "rsa_public.pem");
    }
  };


  const changeFilePemPublic = (files) => {
    const file = files[0];
    if (!file) {
      return;
    }
    if (file.size > 1024 * 1024 * 50) {
      return alert("文件太大");
    }
    const reader = new FileReader();
    reader.onload = async function () {
      const publicKey = reader.result;
      setRsaKeyPair({
        ...rsaKeyPair,
        publicKey: publicKey,
      });
    };
    reader.readAsText(file);
  };

  const encryptKeyRsa = async () => {
    try{
      const encryptedKey = await encryptStringRsa(inputString, rsaKeyPair.publicKey);
      setEncryptedString(encryptedKey);
    }catch(err){
      alert('Encryption failed.')
    }
  };

  const onKeyInputChange = async (e) => {
    setInputString(e.target.value);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <h1 className="pt-[20px] pb-[20px]">RSA String Encrypt</h1>
        <div className="pt-[10px] text-left w-full flex-1">
          <div>
            <label
              htmlFor="small-input"
              className="whitespace-normal break-all font-bold block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Input string to encrypt
            </label>
            <input
              onChange={onKeyInputChange}
              type="text"
              id="small-input"
              className="input-text"
            />
           
          </div>
          <div className="flex mt-[10px]">
            <button
              type="button"
              onClick={generateRSAKey}
              className="button"
            >
              Generate RSA Key
            </button>
            <button
              type="button"
              onClick={downloadPemFiles}
              className="button"
            >
              Download Pem Files
            </button>
            <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file-pem-public"
                className="cursor-pointer button"
              >
                Import Public Key Pem File
                <input
                  id="dropzone-file-pem-public"
                  type="file"
                  className="hidden"
                  onChange={(e) => changeFilePemPublic(e.target.files)}
                />
              </label>
            </div>
          </div>
          {rsaKeyPair && (rsaKeyPair.privateKey || rsaKeyPair.publicKey) && (
            <>
              <div className="text-left">
                <span className="font-bold">Encryption algorithm:</span>{" "}
                RSA-OAEP
              </div>
              <div className="text-left">
                <span className="font-bold">Modulus length:</span> 2048
              </div>
              <div className="text-left">
                <span className="font-bold">Hash:</span> SHA-256
              </div>
              <div className="flex">
                {rsaKeyPair.privateKey && (
                  <div className="flex-1">
                    <textarea
                      disabled
                      value={rsaKeyPair.privateKey}
                      id="message"
                      rows="6"
                      className="textarea"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
                {rsaKeyPair.publicKey && (
                  <div className="flex-1">
                    <textarea
                      disabled
                      value={rsaKeyPair.publicKey}
                      id="message"
                      rows="6"
                      className="textarea"
                      placeholder="Write your thoughts here..."
                    ></textarea>
                  </div>
                )}
              </div>
              {(rsaKeyPair.publicKey && inputString ) && (
                <>
                  <div className="flex mt-[10px]">
                    <button
                      type="button"
                      onClick={encryptKeyRsa}
                      className="button"
                    >
                      Encrypt the string with RSA
                    </button>
                  </div>
                  {encryptedString && (
                    <div className="break-all">
                    <span className="font-bold">Encrypted string (Base64): </span>{encryptedString}
                  </div>
                  )}
                  
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
