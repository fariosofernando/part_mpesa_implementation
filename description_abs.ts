import type Result from "./result_util";

abstract class PaymentServiceDescription {
	abstract C2B(payload: PayloadDescrption): Promise<Result<string>>;
}

interface PayloadDescrption {
	inputTransactionReference: string;
	inputCustomerMsisdn: string;
	inputAmount: number;
	inputThirdPartyReference: string;
}

export { PaymentServiceDescription, type PayloadDescrption };
