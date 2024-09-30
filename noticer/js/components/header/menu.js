const { Link, useParams, useSearchParams, BrowserRouter } = ReactRouterDOM;

export const Header = () => {
  // const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  
  return (
    <header id="step1" className="header">
    
      <Link className={``} to="/?page=aes_file_encrypt">
        AES File Encrypt & Decrypt
      </Link>
      <Link className={``} to="/?page=rsa_key_encrypt">
        RSA String Encrypt
      </Link>
      <Link className={``} to="/?page=rsa_key_decrypt">
        RSA String Decrypt
      </Link>
     
    </header>
  )
}

