import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseService } from '../../services/purchase.service';
import { OfferService } from '../../services/offer.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-comprar',
  standalone: true,
  imports: [CommonModule], // Añade esta línea
  templateUrl: './comprar-page.component.html',
  styleUrls: ['./comprar-page.component.css']
})
export class ComprarComponent implements OnInit {
  type: 'ticket' | 'pass' = 'ticket';
  id: number = 0;
  stands: any[] = [];
  selectedStand: any = null;
  offerImageUrl: SafeUrl = '';
  stadiumImageUrl: SafeUrl = '';
  offerDetails: any = null;
  loading = true;
  showSuccessModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private purchaseService: PurchaseService,
    private offerService: OfferService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.type = params['type'] || 'ticket';
      this.id = +params['id'];
      this.loadOfferDetails();
    });
  }

  loadOfferDetails(): void {
    this.loading = true;
    
    if (this.type === 'ticket') {
      this.purchaseService.getTicketStands(this.id).subscribe({
        next: (stands) => {
          this.stands = stands;
          this.loadTicketImage();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading ticket stands:', err);
          this.loading = false;
        }
      });
    } else {
      this.purchaseService.getSeasonPassStands(this.id).subscribe({
        next: (data) => {
          this.stands = data.prices;
          this.offerDetails = data;
          this.loadSeasonPassImage();
          this.loadStadiumImage(data.stadiumImageId);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading season pass stands:', err);
          this.loading = false;
        }
      });
    }
  }

  loadTicketImage(): void {
    this.stadiumImageUrl = this.sanitizer.bypassSecurityTrustUrl('img/llaneros.jpg');
  }

  loadSeasonPassImage(): void {
    // Cambiamos a usar el método público del servicio
    this.offerService.getImageUrlPublic(this.offerDetails.imageId).subscribe(url => {
      this.offerImageUrl = url;
    });
  }

  loadStadiumImage(imageId: string): void {
    this.purchaseService.getStadiumImageUrl(imageId).subscribe(url => {
      this.stadiumImageUrl = url;
    });
  }

  selectStand(stand: any): void {
    this.selectedStand = stand;
  }


  finalizePurchase(): void {
  if (!this.selectedStand) return;

  console.log('Tipo antes de comprar:', this.type); // ← Verifica que sea 'pass' o 'ticket'
  let typeVerificado = 'season-pass';
if (typeVerificado === this.type) {
    const hola = "pass"
    this.purchaseService.registerPurchase(this.selectedStand.saleId, hola).subscribe(
    {
      next: () => {
        this.showSuccessModal = true;
      },
      
      error: (err) => {
        console.log('Registrando compra con:', this.selectedStand.saleId, hola);

        console.error('Error during purchase:', err);
        alert('Ocurrió un error al procesar la compra');
      }
    }
  );
  console.log('Son iguales');
}
else {
  this.purchaseService.registerPurchase(this.selectedStand.saleId, this.type).subscribe(
    {
      next: () => {
        this.showSuccessModal = true;
      },
      
      error: (err) => {
        console.log('Registrando compra con:', this.selectedStand.saleId, this.type);

        console.error('Error during purchase:', err);
        alert('Ocurrió un error al procesar la compra');
      }
    }
  );
}

}

  closeModal(): void {
    this.showSuccessModal = false;
    this.router.navigate(['/dashboardUser']);
  }
}