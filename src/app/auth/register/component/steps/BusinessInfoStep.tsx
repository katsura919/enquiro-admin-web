import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BusinessInfoStepProps {
  businessName: string;
  setBusinessName: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  address: string;
  setAddress: (value: string) => void;
  errors: Record<string, string>;
}

export default function BusinessInfoStep({
  businessName,
  setBusinessName,
  category,
  setCategory,
  description,
  setDescription,
  address,
  setAddress,
  errors,
}: BusinessInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Business Information
        </h2>
        <p className="text-base text-gray-400 leading-relaxed">
          Tell us about your business
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-300 block"
              htmlFor="businessName"
            >
              Business Name
            </label>
            <Input
              id="businessName"
              type="text"
              placeholder="Acme Corporation"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={`w-full h-12 text-base bg-white/5 border text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm ${
                errors.businessName
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-blue-500/30 focus:border-blue-400 focus:ring-blue-400/20"
              }`}
            />
            {errors.businessName && (
              <p className="text-sm text-red-400 mt-1">{errors.businessName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-300 block"
              htmlFor="category"
            >
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className={`w-full h-12 text-base bg-white/5 border text-white focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm ${
                  errors.category
                    ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                    : "border-blue-500/30 focus:border-blue-400 focus:ring-blue-400/20"
                }`}
              >
                <SelectValue
                  placeholder="Select business category"
                  className="text-gray-500"
                />
              </SelectTrigger>
              <SelectContent className="bg-black border-white/20 backdrop-blur-lg max-h-60 shadow-xl">
                <SelectItem
                  value="technology"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Technology
                </SelectItem>
                <SelectItem
                  value="healthcare"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Healthcare
                </SelectItem>
                <SelectItem
                  value="finance"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Finance & Banking
                </SelectItem>
                <SelectItem
                  value="retail"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Retail & E-commerce
                </SelectItem>
                <SelectItem
                  value="manufacturing"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Manufacturing
                </SelectItem>
                <SelectItem
                  value="education"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Education
                </SelectItem>
                <SelectItem
                  value="realestate"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Real Estate
                </SelectItem>
                <SelectItem
                  value="hospitality"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Hospitality & Tourism
                </SelectItem>
                <SelectItem
                  value="food"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Food & Beverage
                </SelectItem>
                <SelectItem
                  value="automotive"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Automotive
                </SelectItem>
                <SelectItem
                  value="construction"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Construction
                </SelectItem>
                <SelectItem
                  value="consulting"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Consulting
                </SelectItem>
                <SelectItem
                  value="marketing"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Marketing & Advertising
                </SelectItem>
                <SelectItem
                  value="legal"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Legal Services
                </SelectItem>
                <SelectItem
                  value="nonprofit"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Non-Profit
                </SelectItem>
                <SelectItem
                  value="logistics"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Logistics & Transportation
                </SelectItem>
                <SelectItem
                  value="media"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Media & Entertainment
                </SelectItem>
                <SelectItem
                  value="fitness"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Fitness & Wellness
                </SelectItem>
                <SelectItem
                  value="beauty"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Beauty & Personal Care
                </SelectItem>
                <SelectItem
                  value="agriculture"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Agriculture
                </SelectItem>
                <SelectItem
                  value="energy"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Energy & Utilities
                </SelectItem>
                <SelectItem
                  value="insurance"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Insurance
                </SelectItem>
                <SelectItem
                  value="telecommunications"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Telecommunications
                </SelectItem>
                <SelectItem
                  value="government"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Government
                </SelectItem>
                <SelectItem
                  value="other"
                  className="text-white hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white cursor-pointer"
                >
                  Other
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-400 mt-1">{errors.category}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-300 block"
              htmlFor="description"
            >
              Description
              <span className="text-xs text-gray-500 ml-2">
                ({description.length}/120 characters)
              </span>
            </label>
            <Textarea
              id="description"
              placeholder="Software Development and consulting services..."
              value={description}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 120) {
                  setDescription(value);
                }
              }}
              maxLength={120}
              className={`w-full min-h-[80px] max-h-[120px] resize-y text-base bg-white/5 border text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm ${
                errors.description
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-blue-500/30 focus:border-blue-400 focus:ring-blue-400/20"
              }`}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">{errors.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-gray-300 block"
              htmlFor="address"
            >
            Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, City, State 12345"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`w-full h-12 text-base bg-white/5 border text-white placeholder:text-gray-500 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200 backdrop-blur-sm ${
                errors.address
                  ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20"
                  : "border-blue-500/30 focus:border-blue-400 focus:ring-blue-400/20"
              }`}
            />
            {errors.address && (
              <p className="text-sm text-red-400 mt-1">{errors.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
