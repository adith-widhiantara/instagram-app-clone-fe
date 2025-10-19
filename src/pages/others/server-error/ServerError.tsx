import { Link } from 'react-router-dom'

const ServerError = () => {
  return (
    <div className="lg:p-8 h-screen">
      <div className="flex items-center text-lg font-medium" data-testid="logo">
        SERVER ERROR
      </div>
      <div className="h-full flex justify-center pt-20">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold" data-testid="title">
            Halaman sedang tidak dapat diakses
          </h1>
          <p data-testid="message">
            Mohon maaf atas kendala yang dialami, harap menghubungi bagian
            administrator
          </p>
          <Link className=" text-blue-alurkerja" to="/">
            Kembali ke home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ServerError
