import  AesFileEncryptPage from "../pages/AesFileEncryptPage.js";
import RsaKeyEncryptPage from "./RsaStringEncryptPage.js";
import RsaKeyDecryptPage from "./RsaStringDecryptPage.js";

const {  useSearchParams } = ReactRouterDOM

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
    
      {(!searchParams.get('page') || searchParams.get('page') === "aes_file_encrypt") && <AesFileEncryptPage/>}
      { searchParams.get('page') === "rsa_key_encrypt" && <RsaKeyEncryptPage/>}
      { searchParams.get('page') === "rsa_key_decrypt" && <RsaKeyDecryptPage/>}
      
    </>
  );
}

export default HomePage;