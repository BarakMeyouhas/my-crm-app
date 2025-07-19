import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";

import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
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
      this.router.navigate(["/login"]);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.role === "admin") {
        return true;
      } else {
        this.router.navigate(["/dashboard"]);
        return false;
      }
    } catch (err) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }
}
