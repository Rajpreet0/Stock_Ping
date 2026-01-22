import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from 'lucide-react';

const SubscriptionForm = () => {
  return (
    <div className="space-y-3 mt-12">
        <h1 className="text-2xl font-bold">Tägliche Stock Updates erhalten</h1>
        <p>Abonnieren Sie, um die Top-Performer in Ihrem Posteingang zu erhalten.</p>
        {/* INPUT */}
        <form className="flex items-center gap-2 max-w-lg">
            <Input
                required
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-lg"
            />
            <Button type="submit">
                <Mail className="w-4 h-4 mr-2"/>
                Subscribe    
            </Button>
        </form>
    </div>
  )
}

export default SubscriptionForm