import Lottie from "lottie-react"
import checkAnimation from "../../../../../../public/animations/check.json"

export default function RegistrationCompleteStep() {
  return (
    <div className="space-y-8 text-center py-12">
      <div className="space-y-6">
        <div className="flex justify-center">
          <div className="w-24 h-24">
            <Lottie 
              animationData={checkAnimation}
              loop={false}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white tracking-tight">Welcome to Enquiro!</h2>
          <p className="text-lg text-gray-300 leading-relaxed">
            Registration completed successfully! Redirecting you to your dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}