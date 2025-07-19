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
      return this.router.parseUrl("/login");
    }

    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("token");
        return this.router.parseUrl("/login");
      }

      // בדיקה לפי תפקיד אם יש דרישה בראוט
      const expectedRoles = route.data['roles'] as string[];
      if (expectedRoles && !expectedRoles.includes(decoded.role)) {
        return this.router.parseUrl("/unauthorized"); // או תעשה רידיירקט אחר
      }

      return true;
    } catch (err) {
      localStorage.removeItem("token");
      return this.router.parseUrl("/login");
    }
  }
}
