import { BadRequestException } from '@nestjs/common'
import { HttpException } from '@nestjs/common/exceptions/http.exception'

export class ErrorEntity {
    public id: string
    public links: string
    public title: string
    public detail: string
    public code: number
    public source: string
    public meta: string

    constructor(
      id: string,
      links: string,
      title: string,
      details: string,
      code: number,
      source: string,
      meta: string,
    ) {
      this.id = id
      this.links = links
      this.meta = meta
      this.detail = details
      this.code = code
      this.source = source
      this.meta = meta
      this.title = title
    }
}

export class ButlerException extends HttpException {
    public  errors: ErrorEntity[] = []
    constructor(title: string, code: number, error: ErrorEntity[]) {
      super(title, code)
      this.errors = error
    }

}