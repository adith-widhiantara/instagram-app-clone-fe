import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="lg:p-8 h-screen">
      <div className="flex items-center text-lg font-medium" data-testid="logo">
        404 NOT FOUND
      </div>
      <div className="h-full flex justify-center pt-20">
        <div>
          <h1 className="text-5xl font-bold" data-testid="message">
            Halaman Tidak Ditemukan!
          </h1>
          <Link className=" text-blue-alurkerja" to="/">
            Kembali ke home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
