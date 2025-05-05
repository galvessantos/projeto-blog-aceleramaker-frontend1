import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { PostagemService } from '../../../../core/services/postagem.service';
import { Postagem } from '../../../../core/models/postagem.model';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  postagens: Postagem[] = [];
  loading = false;
  totalPosts = 0;
  postsByAuthor: Record<string, number> = {};
  recentPosts: Postagem[] = [];
  chartLabels: string[] = [];
  chartData: number[] = [];
  chartColors: string[] = [];
  barChart: Chart | null = null;
  pieChart: Chart | null = null;

  constructor(
    private postagemService: PostagemService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.loadPostagens();
  }
  
  ngAfterViewInit(): void {
  }

  loadPostagens(): void {
    this.postagemService.getAllPosts(0, 100).subscribe({
      next: (response) => {
        this.postagens = response.content;
        this.totalPosts = response.totalElements;
        this.recentPosts = [...this.postagens]
          .sort((a, b) => new Date(b.creationTimestamp).getTime() - new Date(a.creationTimestamp).getTime())
          .slice(0, 5);
        
        this.groupPostsByAuthor();
        
        this.prepareChartData();
        
        this.initCharts();
        
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Erro ao carregar dados: ' + error.message, 'Fechar', {
          duration: 5000
        });
        this.loading = false;
      }
    });
  }

  groupPostsByAuthor(): void {
    this.postsByAuthor = {};
    
    this.postagens.forEach(post => {
      const authorName = post.usuario.nome;
      if (!this.postsByAuthor[authorName]) {
        this.postsByAuthor[authorName] = 0;
      }
      this.postsByAuthor[authorName]++;
    });
  }

  prepareChartData(): void {
    this.chartLabels = Object.keys(this.postsByAuthor);
    this.chartData = Object.values(this.postsByAuthor);
    
    this.chartColors = this.chartLabels.map(() => this.getRandomColor());
  }

  getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  initCharts(): void {
    setTimeout(() => {
      const barChartCtx = document.getElementById('postsPerAuthorChart') as HTMLCanvasElement;
      if (barChartCtx) {
        this.barChart = new Chart(barChartCtx, {
          type: 'bar',
          data: {
            labels: this.chartLabels,
            datasets: [{
              label: 'Número de Postagens',
              data: this.chartData,
              backgroundColor: this.chartColors,
              borderColor: this.chartColors.map(color => color + '80'),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1
                }
              }
            },
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
      
      const pieChartCtx = document.getElementById('postsDistributionChart') as HTMLCanvasElement;
      if (pieChartCtx) {
        this.pieChart = new Chart(pieChartCtx, {
          type: 'pie',
          data: {
            labels: this.chartLabels,
            datasets: [{
              data: this.chartData,
              backgroundColor: this.chartColors,
              borderColor: '#ffffff',
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }
    }, 100);
  }
}