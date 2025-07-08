export default function Footer() {
  return (
    <footer className="w-full py-6 backdrop-blur-sm ">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 Enquiro. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-blue-400">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
