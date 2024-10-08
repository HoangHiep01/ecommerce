import { applyDecorators, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';

export function ApiDocument(summry, description) {
  return applyDecorators(
    HttpCode(HttpStatus.OK),
    ApiOperation({ summary: summry }),
    ApiOkResponse({ description: description }),
  );
}
