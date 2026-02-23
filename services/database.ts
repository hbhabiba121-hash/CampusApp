import * as SQLite from 'expo-sqlite';

export type Student = {
  id: number;
  name: string;
  email: string;
  role: string;
};

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    try {
      this.db = await SQLite.openDatabaseAsync('campus.db');
      
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS students (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          role TEXT NOT NULL
        );
      `);
      
      console.log('Database initialized successfully');
      return true;
    } catch (error) {
      console.error('Database initialization error:', error);
      return false;
    }
  }

  async getAllStudents(): Promise<Student[]> {
    if (!this.db) return [];
    
    try {
      const rows = await this.db.getAllAsync<any>(
        'SELECT * FROM students ORDER BY name ASC'
      );
      
      return rows.map(row => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role
      }));
    } catch (error) {
      console.error('Error getting students:', error);
      return [];
    }
  }

  async addStudent(student: Omit<Student, 'id'>): Promise<Student | null> {
    if (!this.db) return null;
    
    try {
      const result = await this.db.runAsync(
        'INSERT INTO students (name, email, role) VALUES (?, ?, ?)',
        student.name,
        student.email,
        student.role
      );
      
      return { 
        id: result.lastInsertRowId, 
        ...student 
      };
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
    }
  }

  async updateStudent(id: number, updates: Partial<Student>): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      // Récupérer l'étudiant existant
      const existingStudent = await this.db.getFirstAsync<any>(
        'SELECT * FROM students WHERE id = ?', 
        id
      );
      
      if (!existingStudent) return false;
      
      // Préparer les valeurs à mettre à jour
      const name = updates.name ?? existingStudent.name;
      const email = updates.email ?? existingStudent.email;
      const role = updates.role ?? existingStudent.role;
      
      await this.db.runAsync(
        'UPDATE students SET name = ?, email = ?, role = ? WHERE id = ?',
        name,
        email,
        role,
        id
      );
      
      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      return false;
    }
  }

  async deleteStudent(id: number): Promise<boolean> {
    if (!this.db) return false;
    
    try {
      await this.db.runAsync('DELETE FROM students WHERE id = ?', id);
      return true;
    } catch (error) {
      console.error('Error deleting student:', error);
      return false;
    }
  }
}

export default new DatabaseService();