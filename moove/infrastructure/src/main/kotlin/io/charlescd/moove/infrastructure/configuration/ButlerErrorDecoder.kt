package io.charlescd.moove.infrastructure.configuration

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import feign.Response
import feign.codec.ErrorDecoder
import io.charlescd.moove.domain.MooveErrorCode
import io.charlescd.moove.domain.exceptions.BusinessException
import io.charlescd.moove.domain.exceptions.NotFoundException
import io.charlescd.moove.domain.exceptions.UnauthorizedException
import java.io.IOException
import java.lang.Exception
import java.lang.IllegalArgumentException
import java.lang.RuntimeException
import java.nio.charset.StandardCharsets
import org.slf4j.LoggerFactory
import org.springframework.util.StreamUtils

class ButlerErrorDecoder : ErrorDecoder {
    private val logger = LoggerFactory.getLogger(this.javaClass)
    override fun decode(methodKey: String?, response: Response?): Exception {
        println("Resposta:"+response?.body())
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
        var responseAsString: String? = null
        try {
            responseAsString = response?.body()?.let {
                StreamUtils.copyToString(it.asInputStream(), StandardCharsets.UTF_8)
            }
            return responseAsString?.let {
                getResponseAsObject(it)
            }
        } catch (ex: IOException) {
            logger.error(ex.message, ex)
            return responseAsString ?: "Error reading response of request"
        }
    }
    private fun getResponseAsObject(message: String): String {
        val objectResponse = jacksonObjectMapper().readValue(message, ErrorDetailed::class.java)
        println(objectResponse)
        println (objectResponse.errors.map {
                error -> StringBuilder().appendln(error.title).appendln(error.detail)
        })
        return objectResponse.errors.map {
            error -> StringBuilder().appendln(error.title).appendln(error.detail)
        }.reduce {
                acc, error -> acc.appendln(error)
        }.toString()
    }
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class ErrorDetailed(
    val errors: Array<Error>
)
data class Error(
    val title: String,
    val detail: String,
    val meta:Map<String, Any>,
    val status: Int,
    val source:Map<String, Any>
)
