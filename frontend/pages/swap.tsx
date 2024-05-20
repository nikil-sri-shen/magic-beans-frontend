import { useEffect, useState } from "react"
import Auth from "../components/Auth"
import PageHeading from "../components/PageHeading"
import SectionHeading from "../components/SectionHeading"
import SwapForm from "../components/SwapForm"
import fetchExchangeInfo, { ExchangeInfo } from "../lib/fetchExchangeInfo"
import { useStacks } from "../providers/StacksProvider"
import { useTransactionToasts } from "../providers/TransactionToastProvider"

export default function SwapPage() {
  const { addTransactionToast } = useTransactionToasts()
  const { network, address } = useStacks()
  const [exchangeInfo, setExchangeInfo] = useState<ExchangeInfo | undefined>(undefined)

  const exchangeRatio = exchangeInfo && exchangeInfo.stxBalance ? exchangeInfo.tokenBalance / exchangeInfo.stxBalance : undefined

  const fetchExchangeInfoOnLoad = async () => {
    if (!address) {
      console.log("Can't fetch exchange info without sender address")
      return
    }

    const exchangeInfo = await fetchExchangeInfo(network, address)
    setExchangeInfo(exchangeInfo)
  }

  useEffect(() => {
    fetchExchangeInfoOnLoad()
  }, [address])

  const stxToTokenSwap = async (stxAmount: number) => {
    if (!address || !exchangeInfo) {
      console.error("Address and exchange info are required for stxToTokenSwap")
      return
    }

    // TODO!
  }

  const tokenToStxSwap = async (tokenAmount: number) => {
    if (!address || !exchangeInfo) {
      console.error("Address and exchange info are required for tokenToStxSwap")
      return
    }

    // TODO!
  }

  const makeExchangeRatioSection = () => {
    if (!exchangeInfo) {
      return <p>Fetching exchange data...</p>
    }
    if (!exchangeRatio) {
      return <p>No liquidity yet!</p>
    }

    // toFixed(6) rounds to 6 decimal places, the + removes trailing 0s. Eg. 0.050000 -> 0.05
    return (
      <section>
        <p>1 STX = <b>{+exchangeRatio.toFixed(6)}</b> Magic Beans</p>
        <p>Current balance: <b>{+exchangeInfo.stxBalance.toFixed(6)}</b> STX and <b>{+exchangeInfo.tokenBalance.toFixed(6)}</b> Magic Beans</p>
      </section>
    )
  }

  return (
    <div className="flex flex-col max-w-4xl gap-12 px-8 m-auto">
      <PageHeading>Swap</PageHeading>

      <Auth />

      {makeExchangeRatioSection()}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section>
          <SectionHeading>Swap STX to Magic Beans</SectionHeading>

          <SwapForm inputCurrency="STX" decimals={6} swapFunction={stxToTokenSwap} />
        </section>

        <section>
          <SectionHeading>Swap Magic Beans to STX</SectionHeading>

          <SwapForm inputCurrency="MAGIC" decimals={0} swapFunction={tokenToStxSwap} />
        </section>
      </div>
    </div >
  )
}