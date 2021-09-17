package io.charlescd.moove.infrastructure.configuration

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import feign.Response
import feign.Util
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.exceptions.UnauthorizedException
import org.slf4j.LoggerFactory

class ButlerErrorDecoder : ErrorDecoder {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    override fun decode(methodKey: String?, response: Response?): Exception {
        val responseMessage: String = getMessage(response)
        println("Mensagem"+responseMessage)
        return when (response?.status()) {
            400 -> IllegalArgumentException(responseMessage)
            404 -> NotFoundException(responseMessage, null)
            422 -> BusinessException.of(MooveErrorCode.INVALID_PAYLOAD, responseMessage ?: response.reason())
            401 -> UnauthorizedException(responseMessage)
            else -> RuntimeException(responseMessage)
        }
    }

    private fun getMessage(response: Response?): String {
        val responseMessage = this.extractMessageFromResponse(response)
        return responseMessage ?: "The server could not complete the request."
    }

    private fun extractMessageFromResponse(response: Response?): String? {
        return response?.let{
            it -> readBody(it)
        }
    }
    private fun readBody(response: Response): String {
        val bodyReader = response.body().asReader()
        return bodyReader.use {
            val responseBody: String = Util.toString(bodyReader)
             extractErrorMessages(jacksonObjectMapper().readValue(responseBody, ErrorAggregator::class.java))
        }
    }

    private fun extractErrorMessages(errorAggregator: ErrorAggregator): String {
       return errorAggregator.let{
            it.errors.map {
                error -> StringBuilder().appendln(error.title).appendln(error.detail)
            }.reduce {
                acc, error -> acc.appendln(error)
            }.toString()
        }
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class ErrorAggregator(
    val errors: Array<Error>
)
data class Error(
    val title: String,
    val detail: String,
    val meta:Map<String, Any>,
    val status: Int,
    val source:Map<String, Any>
)
