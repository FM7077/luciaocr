import { bootstrapApplication } from "@angular/platform-browser";
import { provideLuciaocr } from "@luciaocr/angular";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideLuciaocr({
      assetBaseUrl: "/ocr-runtime/",
    }),
  ],
}).catch((error) => console.error(error));
