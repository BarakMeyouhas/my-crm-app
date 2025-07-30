import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("AuthGuard: No token found, redirecting to login");
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        console.log("AuthGuard: Token expired, redirecting to login");
        localStorage.removeItem("token");
        this.router.navigate(['/login']);
        return false;
      }

      // בדיקה לפי תפקיד אם יש דרישה בראוט
      const expectedRoles = route.data['roles'] as string[];
      if (expectedRoles && !expectedRoles.includes(decoded.role)) {
        console.log("AuthGuard: Insufficient role, redirecting to unauthorized");
        this.router.navigate(['/unauthorized']);
        return false;
      }

      console.log("AuthGuard: Access granted");
      return true;
    } catch (err) {
      console.log("AuthGuard: Token invalid, redirecting to login");
      localStorage.removeItem("token");
      this.router.navigate(['/login']);
      return false;
    }
  }
}
