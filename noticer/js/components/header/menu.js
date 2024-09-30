const { Link, useParams, useSearchParams, BrowserRouter } = ReactRouterDOM;

export const Header = () => {
  // const params = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  
  return (
    <header id="step1">
      <nav>
        <ul>
          <li>
            <Link to="/?page=aes_file_encrypt">
              AES File Encrypt & Decrypt
            </Link>
          </li>
          <li>
            <Link to="/?page=rsa_key_encrypt">
              RSA String Encrypt
            </Link>
          </li>
          <li>
            <Link to="/?page=rsa_key_decrypt">
              RSA String Decrypt
            </Link>
          </li>
        </ul>
      </nav>     
    </header>
  )
}

