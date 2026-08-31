import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { creditService } from '@/lib/credits'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, CreditCard, ArrowRight, Home, Zap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { RefreshButton } from './RefreshButton'
import { AutoLaunchShoot } from './AutoLaunchShoot'
import { formatPrice, formatCredits } from '@/lib/pricing-plans'

interface PaymentSuccessPageProps {
  searchParams: Promise<{
    session_id?: string
    payment_id?: string
    status?: string
    amount?: string
    credits?: string
    plan_name?: string
    resume?: string
  }>
}

export default async function PaymentSuccessPage({ searchParams }: PaymentSuccessPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get current credit balance
  const { balance, error } = await creditService.getUserCredits(user.id)
  
  if (error) {
    console.error('Error fetching credits:', error)
  }

  // Await search params before accessing properties
  const params = await searchParams
  
  // Extract payment details from search params
  const sessionId = params.session_id
  const paymentId = params.payment_id
  const urlStatus = params.status
  const amount = params.amount ? parseFloat(params.amount) : 0
  const credits = params.credits ? parseInt(params.credits) : 0
  const planName = params.plan_name || 'Credit Package'

  // Fetch actual payment details from database if session_id or payment_id is provided
  let paymentDetails = null
  let paymentStatus = urlStatus || 'pending'
  
  const lookupId = sessionId || paymentId
  if (lookupId) {
    try {
      const { data: payment, error: paymentError } = await supabase
        .from('dodo_payments')
        .select(`
          *,
          dodo_pricing_plans (
            name,
            credits,
            price
          )
        `)
        .eq('dodo_payment_id', lookupId)
        .single()

      if (!paymentError && payment) {
        paymentDetails = payment
        // Use database status if available, otherwise fall back to URL status
        paymentStatus = payment.status || urlStatus || 'pending'
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
      // If database lookup fails but we have URL status, use it
      paymentStatus = urlStatus || 'pending'
    }
  }

  // Map URL status to internal status
  const normalizedStatus = paymentStatus === 'succeeded' ? 'completed' : paymentStatus
  
  // Use database details if available, otherwise fall back to URL parameters
  const displayAmount = paymentDetails?.amount || amount
  const displayCredits = paymentDetails?.credits || credits
  const displayPlanName = paymentDetails?.dodo_pricing_plans?.name || planName
  const isPaymentCompleted = normalizedStatus === 'completed'
  const isPaymentFailed = normalizedStatus === 'failed'
  const isPaymentPending = normalizedStatus === 'pending'
  const requiresCustomerAction = normalizedStatus === 'requires_customer_action'

  // Client-side purchase tracking script
  const TrackingScript = () => (
    <script dangerouslySetInnerHTML={{
      __html: `
        (function(){
          try {
            var completed = ${isPaymentCompleted ? 'true' : 'false'};
            var failed = ${isPaymentFailed ? 'true' : 'false'};
            var pending = ${isPaymentPending ? 'true' : 'false'};
            var sessionId = ${JSON.stringify(sessionId || '')};
            var paymentId = ${JSON.stringify(paymentId || '')};
            var amount = ${JSON.stringify(displayAmount)};
            var credits = ${JSON.stringify(displayCredits)};
            var planName = ${JSON.stringify(displayPlanName)};
            var currency = 'USD';
            if (typeof gtag === 'function') {
              if (completed) {
                gtag('event', 'purchase', {
                  transaction_id: paymentId || sessionId,
                  value: amount,
                  currency: currency,
                  items: [{ id: planName, name: planName, quantity: 1, price: amount }],
                  credits: credits,
                  plan_name: planName
                });
                try {
                  localStorage.setItem('dodo_last_purchase_session', paymentId || sessionId || '');
                  localStorage.removeItem('dodo_last_checkout_session');
                  localStorage.removeItem('dodo_last_checkout_payload');
                } catch(_) {}
              } else if (failed) {
                gtag('event', 'purchase_failed', {
                  transaction_id: paymentId || sessionId,
                  value: amount,
                  currency: currency,
                  items: [{ id: planName, name: planName, quantity: 1, price: amount }],
                  credits: credits,
                  plan_name: planName
                });
              } else if (pending) {
                gtag('event', 'purchase_pending', {
                  transaction_id: paymentId || sessionId,
                  value: amount,
                  currency: currency,
                  items: [{ id: planName, name: planName, quantity: 1, price: amount }],
                  credits: credits,
                  plan_name: planName
                });
              }
            }
          } catch (e) { /* ignore */ }
        })();
      `
    }} />
  )

  const isDatingShootResume =
    params.resume === 'dating-shoot' ||
    params.resume === 'checkout' ||
    params.resume === 'auto-start'

  if (isDatingShootResume) {
    return (
      <div className="container max-w-lg mx-auto py-16 px-4 min-h-[70vh] flex items-center justify-center">
        <TrackingScript />
        <Card className="w-full border-zinc-800 bg-zinc-950 text-white shadow-2xl rounded-2xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl font-bold font-oxanium text-white">
              Payment Successful
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm mt-1">
              Preparing your 15 photoshoot sessions…
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8">
            <AutoLaunchShoot />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <TrackingScript />
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className={`rounded-full p-3 ${
            isPaymentCompleted ? 'bg-green-100' : isPaymentFailed ? 'bg-red-100' : 'bg-yellow-100'
          }`}>
            {isPaymentCompleted ? (
              <CheckCircle className="h-12 w-12 text-green-600" />
            ) : isPaymentFailed ? (
              <AlertCircle className="h-12 w-12 text-red-600" />
            ) : (
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            )}
          </div>
        </div>
        <h1 className={`text-3xl font-bold mb-2 ${
          isPaymentCompleted ? 'text-green-600' : isPaymentFailed ? 'text-red-600' : 'text-yellow-600'
        }`}>
          {isPaymentCompleted ? 'Payment Successful!' : isPaymentFailed ? 'Payment Failed' : 'Payment Processing'}
        </h1>
        <p className="text-muted-foreground">
          {isPaymentCompleted 
            ? 'Thank you for your purchase. Your credits have been added to your account.'
            : isPaymentFailed
            ? 'Unfortunately, your payment could not be processed. Please try again or contact support.'
            : 'Your payment is being processed. Credits will be added to your account shortly.'
          }
        </p>
      </div>

      {/* Transaction Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Transaction Details</span>
          </CardTitle>
          <CardDescription>
            {isPaymentCompleted ? 'Transaction completed successfully' : isPaymentFailed ? 'Transaction failed' : 'Transaction is being processed'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Package</p>
              <p className="font-semibold">{displayPlanName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="font-semibold">{formatPrice(displayAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Credits {isPaymentCompleted ? 'Added' : 'To Add'}</p>
              <p className="font-semibold">{formatCredits(displayCredits)} credits</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="font-semibold text-green-600">{formatCredits(balance)} credits</p>
            </div>
          </div>
          
          {(paymentId || sessionId) && (
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground">Transaction ID</p>
              <p className="font-mono text-sm">{paymentId || sessionId}</p>
            </div>
          )}
          
          {paymentDetails?.created_at && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">Transaction Date</p>
              <p className="text-sm">
                {new Date(paymentDetails.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={isPaymentCompleted ? 'default' : isPaymentFailed ? 'destructive' : 'secondary'} className={
              isPaymentCompleted ? 'bg-green-100 text-green-800' : isPaymentFailed ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
            }>
              {isPaymentCompleted ? 'Completed' : isPaymentFailed ? 'Failed' : 'Processing'}
            </Badge>
          </div>
        </CardContent>
      </Card>



      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {isPaymentCompleted ? (
          params.resume === 'dating-shoot' || params.resume === 'checkout' || params.resume === 'auto-start' ? (
            <AutoLaunchShoot />
          ) : (
            <>
              <Link href="/dating-shoot">
                <Button className="w-full sm:w-auto cursor-pointer bg-white text-black hover:bg-zinc-200 font-bold">
                  <Zap className="h-4 w-4 mr-2" />
                  Go to Dating Shoot
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              
              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto cursor-pointer border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white">
                  <Home className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            </>
          )
        ) : isPaymentFailed ? (
          <>
            <Link href="/buy-credits">
              <Button className="w-full sm:w-auto">
                Try Again
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            
            <RefreshButton 
              variant="outline" 
              className="w-full sm:w-auto"
            />
          </>
        )}
      </div>

      {/* Additional Information */}
      <div className="mt-8 text-center">
        <div className="max-w-md mx-auto">
          <h3 className="text-lg font-semibold mb-2">Need Help?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            If you have any questions about your purchase or need assistance, 
            please don't hesitate to contact our support team.
          </p>
        </div>
      </div>
    </div>
  )
}