export function checkError(status: number, data: Recordable): void {
  switch (status) {
    case 401:
      window.location.href = `${data['login-location']}?redirect_uri=${window.location.href}`
      break
    default:
  }
}
