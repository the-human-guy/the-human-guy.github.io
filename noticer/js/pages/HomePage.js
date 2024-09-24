import { AesFileEncryptPage } from "../pages/AesFileEncryptPage.js";
import { RsaStringEncryptPage } from "./RsaStringEncryptPage.js";
import { RsaStringDecryptPage } from "./RsaStringDecryptPage.js";

const {  useSearchParams } = ReactRouterDOM

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
    
      {(!searchParams.get('page') || searchParams.get('page') === "aes_file_encrypt") && <AesFileEncryptPage/>}
      { searchParams.get('page') === "rsa_key_encrypt" && <RsaStringEncryptPage/>}
      { searchParams.get('page') === "rsa_key_decrypt" && <RsaStringDecryptPage/>}
      
    </>
  );
}
