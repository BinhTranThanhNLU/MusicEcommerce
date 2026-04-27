package com.springboot.music.responsemodel;

import java.util.Map;

public record ErrorResponse(
		String error,
		String message,
		int status,
		String path,
		String timestamp,
		Map<String, String> fieldErrors
) {

	public ErrorResponse(String error, String message, int status, String path, String timestamp) {
		this(error, message, status, path, timestamp, null);
	}
}

