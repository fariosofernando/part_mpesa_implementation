import Result from "./result_util.ts";

import type {
	PaymentServiceDescription,
	PayloadDescrption,
} from "./description_abs.ts";
import { CryptoUtils } from "./conf/crypto_conf.js";
import type { Keys } from "./conf/keys_conf.js";

export interface MPesaPayloadDescrption extends PayloadDescrption {
	inputTransactionReference: string;
	inputCustomerMsisdn: string;
	inputAmount: number;
	inputThirdPartyReference: string;
}

export enum HTTPStatusCode {
	OK = 200,
	CREATED = 201,
	INTERNAL_SERVER_ERROR = 500,
	UNAUTHORIZED = 401,
	REQUEST_TIMEOUT = 408,
	CONFLICT = 409,
	BAD_REQUEST = 400,
	SERVICE_UNAVAILABLE = 503,
	UNPROCESSABLE_ENTITY = 422,
}

export enum MPesaResponseCode {
	SUCCESS = "INS-0",
	INTERNAL_ERROR = "INS-1",
	INVALID_API_KEY = "INS-2",
	USER_NOT_ACTIVE = "INS-4",
	TRANSACTION_CANCELLED = "INS-5",
	TRANSACTION_FAILED = "INS-6",
	REQUEST_TIMEOUT = "INS-9",
	DUPLICATE_TRANSACTION = "INS-10",
	INVALID_SHORTCODE = "INS-13",
	INVALID_REFERENCE = "INS-14",
	INVALID_AMOUNT = "INS-15",
	UNABLE_TO_HANDLE_REQUEST = "INS-16",
	INVALID_TRANSACTION_REFERENCE = "INS-17",
	INVALID_TRANSACTION_ID = "INS-18",
	INVALID_THIRD_PARTY_REFERENCE = "INS-19",
	MISSING_PARAMETERS = "INS-20",
	PARAMETER_VALIDATION_FAILURE = "INS-21",
	INVALID_OPERATION_TYPE = "INS-22",
	UNKNOWN_STATUS = "INS-23",
	INVALID_INITIATOR_IDENTIFIER = "INS-24",
	INVALID_SECURITY_CREDENTIAL = "INS-25",
	NOT_AUTHORIZED = "INS-26",
	MISSING_DIRECT_DEBIT = "INS-993",
	DUPLICATE_DIRECT_DEBIT = "INS-994",
	CUSTOMER_PROFILE_ISSUES = "INS-995",
	INACTIVE_CUSTOMER_ACCOUNT = "INS-996",
	LINKED_TRANSACTION_NOT_FOUND = "INS-997",
	INVALID_MARKET = "INS-998",
	AUTHENTICATION_ERROR = "INS-2001",
	INVALID_RECIPIENT = "INS-2002",
	INSUFFICIENT_BALANCE = "INS-2006",
	INVALID_MSISDN = "INS-2051",
	INVALID_LANGUAGE_CODE = "INS-2057",
}

export default class MPesaAPIDescription implements PaymentServiceDescription {
	private keys: Keys;

	constructor(keys: Keys) {
		this.keys = keys;
	}

	async C2B(payload: MPesaPayloadDescrption): Promise<Result<string>> {
		const url = `https://${this.keys.host}:18352/ipg/v1x/c2bPayment/singleStage/`;

		const access_token = CryptoUtils.get_bearer_token(
			this.keys.public_key,
			this.keys.api_key,
		);

		const request_data = {
			input_TransactionReference: payload.inputTransactionReference,
			input_CustomerMSISDN: payload.inputCustomerMsisdn,
			input_Amount: payload.inputAmount.toString(),
			input_ThirdPartyReference: payload.inputThirdPartyReference,
			input_ServiceProviderCode: this.keys.short_code,
		};

		const headers = {
			"Content-Type": "application/json",
			Authorization: access_token,
			Origin: this.keys.origin,
		};

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: headers,
				body: JSON.stringify(request_data),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP Error ${response.status} - ${response.statusText}`,
				);
			}

			const code = data.output_ResponseCode;
			const description = data.output_ResponseDesc;

			switch (code) {
				case MPesaResponseCode.SUCCESS:
					return Result.success(description);

				case MPesaResponseCode.INTERNAL_ERROR:
					return Result.failure(`Erro 500 - Internal Error: ${description}`);

				case MPesaResponseCode.INVALID_API_KEY:
					return Result.failure(`Erro 401 - Invalid API Key: ${description}`);

				case MPesaResponseCode.USER_NOT_ACTIVE:
					return Result.failure(
						`Erro 401 - User is not active: ${description}`,
					);

				case MPesaResponseCode.TRANSACTION_CANCELLED:
					return Result.failure(
						`Erro 401 - Transaction cancelled by customer: ${description}`,
					);

				case MPesaResponseCode.TRANSACTION_FAILED:
					return Result.failure(
						`Erro 401 - Transaction Failed: ${description}`,
					);

				case MPesaResponseCode.REQUEST_TIMEOUT:
					return Result.failure(`Erro 408 - Request timeout: ${description}`);

				case MPesaResponseCode.DUPLICATE_TRANSACTION:
					return Result.failure(
						`Erro 409 - Duplicate Transaction: ${description}`,
					);

				case MPesaResponseCode.INVALID_SHORTCODE:
					return Result.failure(`Erro 400 - Invalid Shortcode: ${description}`);

				case MPesaResponseCode.INVALID_REFERENCE:
					return Result.failure(`Erro 400 - Invalid Reference: ${description}`);

				case MPesaResponseCode.INVALID_AMOUNT:
					return Result.failure(`Erro 400 - Invalid Amount: ${description}`);

				case MPesaResponseCode.UNABLE_TO_HANDLE_REQUEST:
					return Result.failure(
						`Unable to handle the request due to: ${description}`,
					);

				case MPesaResponseCode.INVALID_TRANSACTION_REFERENCE:
					return Result.failure(
						`Erro 400 - Invalid Transaction Reference: ${description}`,
					);

				case MPesaResponseCode.INVALID_TRANSACTION_ID:
					return Result.failure(
						`Erro 400 - Invalid Transaction ID: ${description}`,
					);

				case MPesaResponseCode.INVALID_THIRD_PARTY_REFERENCE:
					return Result.failure(
						`Erro 400 - Invalid Third Party Reference: ${description}`,
					);

				case MPesaResponseCode.MISSING_PARAMETERS:
					return Result.failure(
						`Erro 400 - Missing Parameters: ${description}`,
					);

				case MPesaResponseCode.PARAMETER_VALIDATION_FAILURE:
					return Result.failure(
						`Erro 400 - Parameter Validation Failure: ${description}`,
					);

				case MPesaResponseCode.INVALID_OPERATION_TYPE:
					return Result.failure(
						`Erro 400 - Invalid Operation Type: ${description}`,
					);

				case MPesaResponseCode.UNKNOWN_STATUS:
					return Result.failure(`Erro 400 - Unknown Status: ${description}`);

				case MPesaResponseCode.INVALID_INITIATOR_IDENTIFIER:
					return Result.failure(
						`Erro 400 - Invalid Initiator Identifier: ${description}`,
					);

				case MPesaResponseCode.INVALID_SECURITY_CREDENTIAL:
					return Result.failure(
						`Erro 400 - Invalid Security Credential: ${description}`,
					);

				case MPesaResponseCode.NOT_AUTHORIZED:
					return Result.failure(`Erro 400 - Not Authorized: ${description}`);

				case MPesaResponseCode.MISSING_DIRECT_DEBIT:
					throw new Error(`Erro 400 - Missing Direct Debit: ${description}`);

				case MPesaResponseCode.DUPLICATE_DIRECT_DEBIT:
					return Result.failure(
						`Erro 400 - Duplicate Direct Debit: ${description}`,
					);

				case MPesaResponseCode.CUSTOMER_PROFILE_ISSUES:
					return Result.failure(
						`Erro 400 - Customer Profile Issues: ${description}`,
					);

				case MPesaResponseCode.INACTIVE_CUSTOMER_ACCOUNT:
					return Result.failure(
						`Erro 400 - Inactive Customer Account: ${description}`,
					);

				case MPesaResponseCode.LINKED_TRANSACTION_NOT_FOUND:
					return Result.failure(
						`Erro 400 - Linked Transaction Not Found: ${description}`,
					);

				case MPesaResponseCode.INVALID_MARKET:
					return Result.failure(`Erro 400 - Invalid Market: ${description}`);

				case MPesaResponseCode.AUTHENTICATION_ERROR:
					return Result.failure(
						`Erro 400 - Authentication Error: ${description}`,
					);

				case MPesaResponseCode.INVALID_RECIPIENT:
					return Result.failure(`Erro 400 - Invalid Recipient: ${description}`);

				case MPesaResponseCode.INSUFFICIENT_BALANCE:
					return Result.failure(
						`Erro 400 - Insufficient Balance: ${description}`,
					);

				case MPesaResponseCode.INVALID_MSISDN:
					return Result.failure(`Erro 400 - Invalid MSISDN: ${description}`);

				case MPesaResponseCode.INVALID_LANGUAGE_CODE:
					return Result.failure(
						`Erro 400 - Invalid Language Code: ${description}`,
					);

				default:
					return Result.failure(
						`Erro 400 - Código: ${code}, Descrição: ${description}`,
					);
			}
		} catch (error) {
			return Result.failure(`Erro na requisição: ${error}`);
		}
	}
}
